package com.isproj.api

import com.isproj.repo.GroupCrudRepository
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable

@Controller("/api/groups/stats")
class GroupStatsController(
    private val groups: GroupCrudRepository,
) {
    @Get("/avg/should/be/expelled")
    fun avgShouldBeExpelled(): Map<String, Any?> {
        val values = groups.findAll().map { it.shouldBeExpelled.toDouble() }
        val avg = if (values.isEmpty()) null else values.average().let { a -> if (a.isNaN()) null else a }
        return mapOf("avgShouldBeExpelled" to avg)
    }

    @Get("/min/expelled/students")
    fun minByExpelledStudents(): HttpResponse<GroupDto> {
        val min =
            groups.findAll()
                .asSequence()
                .minByOrNull { g -> g.expelledStudents }
        return min?.let { HttpResponse.ok(it.toDto()) } ?: HttpResponse.noContent()
    }

    @Get("/admin/height/greater/{min}")
    fun filterByAdminHeight(
        @PathVariable min: Double,
    ): List<GroupDto> =
        groups.findAll()
            .asSequence()
            .filter { it.groupAdmin.height > min }
            .map { it.toDto() }
            .toList()
}
