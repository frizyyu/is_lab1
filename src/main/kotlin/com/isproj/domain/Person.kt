package com.isproj.domain

import com.isproj.domain.enums.Color
import com.isproj.domain.enums.Country
import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.annotation.MappedProperty
import io.micronaut.data.annotation.Relation
import io.micronaut.data.annotation.Relation.Kind
import io.micronaut.serde.annotation.Serdeable
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive

@Serdeable
@MappedEntity("person")
data class Person(
    @field:Id @field:GeneratedValue
    val id: Long? = null,
    @field:NotBlank
    val name: String,
    @field:NotNull
    val eyeColor: Color,
    @field:NotNull
    val hairColor: Color,
    @field:NotNull @field:Positive
    val height: Double,
    val nationality: Country? = null,
    @Relation(Kind.MANY_TO_ONE)
    @MappedProperty("location_id")
    val location: Location? = null,
)
