package com.isproj.repo

import com.isproj.domain.Group
import io.micronaut.data.annotation.Join
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import io.micronaut.data.repository.PageableRepository
import java.util.Optional

@JdbcRepository(dialect = Dialect.POSTGRES)
@Repository
interface GroupCrudRepository :
    CrudRepository<Group, Long>,
    PageableRepository<Group, Long> {

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    override fun findById(id: Long): Optional<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    override fun findAll(pageable: Pageable): Page<Group>

    @Join("coordinates", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin", type = Join.Type.LEFT_FETCH)
    @Join("groupAdmin.location", type = Join.Type.LEFT_FETCH)
    override fun findAll(): List<Group>

    fun deleteByIdIn(ids: List<Long>)
}
