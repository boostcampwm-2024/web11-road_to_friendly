local shareKey = KEYS[1]
local queueKey = KEYS[2]
local hostFlag = ARGV[1]
local clientId = ARGV[2]

local nowShareClientId = redis.call('HGET', shareKey, 'clientId')

if hostFlag == '1' or (nowShareClientId == clientId) then
    local queueItem = redis.call('LPOP', queueKey)

    if queueItem then
        local interest = cjson.decode(queueItem)
        redis.call('HMSET', shareKey,
                'clientId', interest.clientId,
                'resourceType', interest.resourceType,
                'resourceUrl', interest.resourceUrl)

        local listSize = redis.call('LLEN', queueKey)
        return {queueItem, listSize}
    end

    redis.call('DEL', shareKey)
    return {cjson.null, 0}
end

error("호스트 또는 공유자가 아닙니다.")

