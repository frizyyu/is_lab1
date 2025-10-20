package com.isproj.ws

import com.fasterxml.jackson.databind.ObjectMapper
import com.isproj.live.GroupsStreamService
import com.isproj.live.toReturnGroups
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.OnClose
import io.micronaut.websocket.annotation.OnError
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.ServerWebSocket
import jakarta.inject.Inject
import reactor.core.Disposable

data class SubscribeCmd(val type: String = "subscribe", val minAdminHeight: Int = 0)

@ServerWebSocket("/ws/groups")
class GroupsSocket @Inject constructor(
    private val live: GroupsStreamService,
    private val mapper: ObjectMapper,
) {
    private val subs = mutableMapOf<String, Disposable>()

    @OnMessage
    fun onMessage(msg: String, session: WebSocketSession) {
        val cmd = runCatching { mapper.readValue(msg, SubscribeCmd::class.java) }.getOrNull()
        if (cmd?.type == "subscribe") {
            subs[session.id]?.dispose()

            val snap = live.snapshot().toReturnGroups(cmd.minAdminHeight)
            session.sendAsync(mapper.writeValueAsString(snap))

            val d = live.flux()
                .map { it.toReturnGroups(cmd.minAdminHeight) }
                .subscribe { payload ->
                    session.sendAsync(mapper.writeValueAsString(payload))
                }
            subs[session.id] = d
        }
    }

    @OnClose
    fun onClose(session: WebSocketSession) {
        subs.remove(session.id)?.dispose()
    }

    @OnError
    fun onError(session: WebSocketSession) {
        subs.remove(session.id)?.dispose()
    }
}
