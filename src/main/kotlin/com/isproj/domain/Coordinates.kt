package com.isproj.domain

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.serde.annotation.Serdeable
import jakarta.validation.constraints.NotNull

@Serdeable
@MappedEntity("coordinates")
data class Coordinates(
    @field:Id @field:GeneratedValue
    val id: Long? = null,
    @field:NotNull
    val x: Double,
    @field:NotNull
    val y: Long,
)
