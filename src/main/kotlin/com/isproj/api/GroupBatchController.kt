package com.isproj.api

import com.isproj.repo.GroupCrudRepository
import com.isproj.service.GroupAggregateService
import io.micronaut.data.exceptions.DataAccessException
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Put
import jakarta.validation.Valid
import java.sql.SQLException

@Controller("/api/groups")
class GroupBatchController(
    private val groups: GroupCrudRepository,
    private val aggregate: GroupAggregateService,
    private val live: com.isproj.live.GroupsStreamService,
) {
    @Post("/batch")
    fun createBatch(
        @Body @Valid dtos: List<GroupDto>,
    ): HttpResponse<List<GroupDto>> {
        return try {
            val saved = dtos.map { aggregate.persist(it).toDto() }
            live.broadcastDelta()
            HttpResponse.created(saved)
        } catch (e: DataAccessException) {
            mapDbError(e)
        } catch (_: Exception) {
            HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put("/batch")
    fun updateBatch(
        @Body @Valid dtos: List<GroupDto>,
    ): HttpResponse<List<GroupDto>> {
        if (dtos.any { it.id == null }) return HttpResponse.badRequest()
        return try {
            val saved = dtos.map { aggregate.persist(it).toDto() }
            live.broadcastDelta()
            HttpResponse.ok(saved)
        } catch (e: DataAccessException) {
            mapDbError(e)
        } catch (_: Exception) {
            HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete("/batch")
    fun deleteBatch(
        @Body ids: List<Long>,
    ): HttpResponse<Any> {
        return try {
            if (ids.isNotEmpty()) groups.deleteByIdIn(ids)
            live.broadcastDelta()
            HttpResponse.noContent()
        } catch (_: Exception) {
            HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private fun mapDbError(e: DataAccessException): HttpResponse<List<GroupDto>> {
        val sql = e.cause as? SQLException
        return when (sql?.sqlState) {
            "23505" -> HttpResponse.status(HttpStatus.CONFLICT)
            "23503" -> HttpResponse.status(HttpStatus.CONFLICT)
            "23502", "23514" -> HttpResponse.status(HttpStatus.UNPROCESSABLE_ENTITY)
            else -> HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
