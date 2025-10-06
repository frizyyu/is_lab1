package com.isproj.api

import com.isproj.repo.GroupRepository
import com.isproj.service.GroupAggregateService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Put
import jakarta.validation.Valid

@Controller("/api/groups")
class GroupBatchController(
    private val groups: GroupRepository,
    private val aggregate: GroupAggregateService,
) {
    @Post("/batch")
    fun createBatch(
        @Body @Valid dtos: List<GroupDto>,
    ): HttpResponse<List<GroupDto>> {
        val saved = dtos.map { aggregate.persist(it).toDto() }
        return HttpResponse.created(saved)
    }

    @Put("/batch")
    fun updateBatch(
        @Body @Valid dtos: List<GroupDto>,
    ): HttpResponse<List<GroupDto>> {
        if (dtos.any { it.id == null }) return HttpResponse.badRequest()
        val saved = dtos.map { aggregate.persist(it).toDto() }
        return HttpResponse.ok(saved)
    }

    @Delete("/batch")
    fun deleteBatch(
        @Body ids: List<Long>,
    ): HttpResponse<Any> {
        if (ids.isNotEmpty()) groups.deleteByIdIn(ids)
        return HttpResponse.noContent()
    }
}
