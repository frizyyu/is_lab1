package com.isproj.live

import com.isproj.api.GroupDto
import com.isproj.api.toDto
import com.isproj.repo.GroupCrudRepository
import jakarta.inject.Singleton
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks

@Singleton
class GroupsStreamService(
    private val groupsRepo: GroupCrudRepository,
) {
    private val sink = Sinks.many().multicast().directBestEffort<GroupsState>()

    fun flux(): Flux<GroupsState> = sink.asFlux()

    fun snapshot(): GroupsState {
        val all = groupsRepo.findAll().toList()
        val avg: Double? = if (all.isNotEmpty()) all.map { it.shouldBeExpelled }.average() else null
        val minByExpelled = all.minByOrNull { it.expelledStudents }

        return GroupsState(
            groups = all.map { it.toDto() },
            avgShouldBeExpelled = avg,
            minByExpelled = minByExpelled?.toDto(),
        )
    }

    fun broadcastDelta() {
        sink.tryEmitNext(snapshot())
    }
}

data class GroupsState(
    val groups: List<GroupDto>,
    val avgShouldBeExpelled: Double?,
    val minByExpelled: GroupDto?,
)
