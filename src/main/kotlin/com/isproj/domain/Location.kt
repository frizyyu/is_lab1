package com.isproj.domain

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import jakarta.validation.constraints.NotNull

@MappedEntity("locations")
data class Location(
    @field:Id @field:GeneratedValue
    val id: Long? = null,
    val x: Float? = null,
    @field:NotNull
    val y: Double,
    val z: Long? = null,
)
