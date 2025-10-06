package com.isproj.api

import com.isproj.domain.Group
import com.isproj.repo.GroupRepository
import com.isproj.service.GroupAggregateService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Put
import jakarta.validation.Valid

@Controller("/api/groups")
class GroupController(
    private val groups: GroupRepository,
    private val aggregate: GroupAggregateService,
) {
    @Get
    fun list(): List<GroupDto> = groups.findAll().map { it.toDto() }

    @Get("/{id}")
    fun get(
        @PathVariable id: Long,
    ): HttpResponse<GroupDto> =
        groups.findById(id)
            .map { HttpResponse.ok(it.toDto()) }
            .orElse(HttpResponse.notFound())

    @Post
    fun create(
        @Body @Valid dto: GroupDto,
    ): HttpResponse<GroupDto> {
        val saved: Group = aggregate.persist(dto)
        return HttpResponse.created(saved.toDto())
    }

    @Put("/{id}")
    fun update(
        @PathVariable id: Long,
        @Body @Valid dto: GroupDto,
    ): HttpResponse<GroupDto> {
        val exists = groups.findById(id)
        if (exists.isEmpty) return HttpResponse.notFound()
        val saved = aggregate.persist(dto.copy(id = id))
        return HttpResponse.ok(saved.toDto())
    }

    @Delete("/{id}")
    fun delete(
        @PathVariable id: Long,
    ): HttpResponse<Any> {
        return if (groups.existsById(id)) {
            groups.deleteById(id)
            HttpResponse.noContent()
        } else {
            HttpResponse.notFound()
        }
    }

    @Put("/{id}/expel-all")
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

    @Put("/{id}/add-student")
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
