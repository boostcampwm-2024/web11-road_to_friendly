local shareKey = KEYS[1]
local queueKey = KEYS[2]
local clientId = ARGV[1]
local resourceType = ARGV[2]
local resourceUrl = ARGV[3]

local existingShare = redis.call('EXISTS', shareKey)

if existingShare == 1 then
    local queueLength = redis.call('RPUSH', queueKey,
            cjson.encode({
                clientId = clientId,
                resourceType = resourceType,
                resourceUrl = resourceUrl
            }))

    return queueLength
end

redis.call('HMSET', shareKey,
        'clientId', clientId,
        'resourceType', resourceType,
        'resourceUrl', resourceUrl)
return 0
