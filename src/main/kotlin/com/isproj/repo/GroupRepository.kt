package com.isproj.repo

import com.isproj.domain.Group
import io.micronaut.data.annotation.Join
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import java.util.Optional

@JdbcRepository(dialect = Dialect.POSTGRES)
@Repository
interface GroupRepository : CrudRepository<Group, Long> {
    @Join("coordinates")
    @Join("groupAdmin")
    @Join("groupAdmin.location")
    override fun findAll(): List<Group>

    @Join("coordinates")
    @Join("groupAdmin")
    @Join("groupAdmin.location")
    override fun findById(id: Long): Optional<Group>

    fun deleteByIdIn(ids: Iterable<Long>)
}
