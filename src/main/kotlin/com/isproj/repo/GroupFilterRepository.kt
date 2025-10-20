package com.isproj.repo

import com.isproj.domain.Group
import com.isproj.domain.enums.Color
import com.isproj.domain.enums.Country
import com.isproj.domain.enums.FormOfEducation
import com.isproj.domain.enums.Semester
import io.micronaut.data.annotation.Join
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import io.micronaut.data.repository.PageableRepository

@JdbcRepository(dialect = Dialect.POSTGRES)
@Repository
interface GroupFilterRepository :
    CrudRepository<Group, Long>,
    PageableRepository<Group, Long> {

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByNameEqualsIgnoreCase(name: String, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByGroupAdminNameEqualsIgnoreCase(name: String, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByFormOfEducation(form: FormOfEducation, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findBySemesterEnum(semester: Semester, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByGroupAdminEyeColor(eyeColor: Color, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByGroupAdminHairColor(hairColor: Color, pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    fun findByGroupAdminNationality(nationality: Country, pageable: Pageable): Page<Group>
}
