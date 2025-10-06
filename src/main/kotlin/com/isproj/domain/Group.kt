package com.isproj.domain

import com.isproj.domain.enums.FormOfEducation
import com.isproj.domain.enums.Semester
import io.micronaut.data.annotation.DateCreated
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
@MappedEntity("study_groups")
data class Group(
    @field:Id @field:GeneratedValue
    val id: Long? = null,
    @field:NotBlank
    val name: String,
    @Relation(Kind.MANY_TO_ONE)
    @MappedProperty("coordinates_id")
    @field:NotNull
    val coordinates: Coordinates,
    @DateCreated
    @MappedProperty("creation_date")
    val creationDate: java.time.LocalDateTime? = null,
    @field:NotNull @field:Positive
    val studentsCount: Long,
    @field:NotNull @field:Positive
    val expelledStudents: Long,
    @field:NotNull @field:Positive
    val transferredStudents: Int,
    @field:NotNull
    val formOfEducation: FormOfEducation,
    @field:NotNull @field:Positive
    val shouldBeExpelled: Long,
    @field:NotNull
    val semesterEnum: Semester,
    @Relation(Kind.MANY_TO_ONE)
    @MappedProperty("group_admin_id")
    @field:NotNull
    val groupAdmin: Person,
)
