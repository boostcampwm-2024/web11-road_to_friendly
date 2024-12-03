-- KEYS[1]: Set key
-- KEYS[2]: ZSet key
-- ARGV[1]: participantId
-- ARGV[2]: question, keyword

local added = redis.call('SREM', KEYS[1], ARGV[1])

if added == 1 then
    local newScore = redis.call('ZINCRBY', KEYS[2], -1, ARGV[2])
    return newScore
else
    local currentScore = redis.call('ZSCORE', KEYS[2], ARGV[2])
    return currentScore or 0
end
