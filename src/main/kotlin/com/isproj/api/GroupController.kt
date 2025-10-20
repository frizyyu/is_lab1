package com.isproj.api

import com.isproj.repo.GroupCrudRepository
import com.isproj.service.GroupAggregateService
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.Sort
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Put
import io.micronaut.http.annotation.QueryValue
import jakarta.validation.Valid

@Controller("/api/groups")
class GroupController(
    private val groups: GroupCrudRepository,
    private val aggregate: GroupAggregateService,
    private val live: com.isproj.live.GroupsStreamService,
) {
    @Get
    fun list(
        @QueryValue("filterKey") filterKey: String? = null,
        @QueryValue("filterValue") filterValue: List<String>? = null,
        @QueryValue(defaultValue = "0") page: Int,
        @QueryValue(defaultValue = "20") size: Int,
        @QueryValue(defaultValue = "") sort: String,
    ): HttpResponse<io.micronaut.data.model.Page<GroupDto>> {
        val key = filterKey?.trim().orEmpty()
        val value = filterValue?.firstOrNull()?.trim().orEmpty()

        val pageable = buildPageable(page, size, sort)

        val pageResult = if (key.isBlank() || value.isBlank()) {
            groups.findAll(pageable).map { it.toDto() }
        } else {
            aggregate.findByFilterPaged(key, value, pageable).map { it.toDto() }
        }

        live.broadcastDelta()
        return HttpResponse.ok(pageResult)
    }

    @Get("/filter{?key,value,page,size,sort}")
    fun filter(
        @QueryValue key: String,
        @QueryValue value: List<String>,
        @QueryValue(defaultValue = "0") page: Int,
        @QueryValue(defaultValue = "20") size: Int,
        @QueryValue(defaultValue = "") sort: String,
    ): HttpResponse<io.micronaut.data.model.Page<GroupDto>> {
        val single = value.firstOrNull().orEmpty()
        val pageable = buildPageable(page, size, sort)
        val result = aggregate.findByFilterPaged(key, single, pageable).map { it.toDto() }
        live.broadcastDelta()
        return HttpResponse.ok(result)
    }

    private fun buildPageable(page: Int, size: Int, sort: String): Pageable {
        val sortObj = if (sort.isNotBlank()) {
            val parts = sort.split(",")
            val prop = parts.getOrNull(0)?.trim().orEmpty()
            val dir = parts.getOrNull(1)?.trim()?.lowercase()
            if (prop.isNotBlank()) {
                when (dir) {
                    "desc" -> Sort.of(Sort.Order.desc(prop))
                    else -> Sort.of(Sort.Order.asc(prop))
                }
            } else {
                Sort.unsorted()
            }
        } else {
            Sort.unsorted()
        }

        return Pageable.from(page, size, sortObj)
    }

    @Post
    fun create(@Body @Valid dto: GroupDto): HttpResponse<GroupDto> {
        val saved = aggregate.persist(dto)
        return HttpResponse.created(saved.toDto())
    }

    @Delete("/{id}")
    fun delete(@PathVariable id: Long): HttpResponse<Any> =
        if (groups.existsById(id)) {
            groups.deleteById(id)
            HttpResponse.noContent()
        } else {
            HttpResponse.notFound()
        }

    @Put("/{id}/expel/all")
    fun expelAll(
        @PathVariable id: Long,
    ): HttpResponse<GroupDto> {
        val opt = groups.findById(id)
        if (opt.isEmpty) return HttpResponse.notFound()

        val g = opt.get()
        val updated =
            g.copy(
                studentsCount = 0,
                expelledStudents = g.expelledStudents + g.studentsCount,
                shouldBeExpelled = 0,
                transferredStudents = 0,
            )

        val saved = groups.update(updated)
        return HttpResponse.ok(saved.toDto())
    }

    @Put("/{id}/add/student")
    fun addStudent(
        @PathVariable id: Long,
    ): HttpResponse<GroupDto> {
        val opt = groups.findById(id)
        if (opt.isEmpty) return HttpResponse.notFound()

        val g = opt.get()
        val updated =
            g.copy(
                studentsCount = g.studentsCount + 1,
                transferredStudents = g.transferredStudents + 1,
            )

        val saved = groups.update(updated)
        return HttpResponse.ok(saved.toDto())
    }
}
