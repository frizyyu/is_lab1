package com.isproj.live

import com.isproj.api.GroupDto
import io.micronaut.serde.annotation.Serdeable

@Serdeable
data class ReturnGroups(
    val groups: List<GroupDto>,
    val avgShouldBeExpelled: Double?,
    val minByExpelled: GroupDto?,
    val minByAdmin: List<GroupDto>?,
)

fun GroupsState.toReturnGroups(minAdminHeight: Int): ReturnGroups {
    val filteredByAdmin = groups.filter { it.groupAdmin.height > minAdminHeight }
    return ReturnGroups(
        groups = groups,
        avgShouldBeExpelled = avgShouldBeExpelled,
        minByExpelled = minByExpelled,
        minByAdmin = filteredByAdmin.ifEmpty { null },
    )
}
