-- KEYS[1]: roomId
local roomId = KEYS[1]

-- 통계 저장 Sorted Set의 키 생성
local statsKey = "rooms:" .. roomId .. ":statistics"

-- 내림차순 검색
local statistics = redis.call('ZREVRANGE', statsKey, 0, -1, 'WITHSCORES')

-- 결과를 저장할 테이블 초기화
local result = {}

-- 통계 항목 순회 (2칸씩 이동: 복합키와 점수)
for i = 1, #statistics, 2 do
    local compositeKey = statistics[i]
    local participantCount = tonumber(statistics[i + 1])

    -- 정규 표현식으로 안정적인 문자열 분리
    local questionId = tonumber(compositeKey:match("questions:([^:]+):keywords:"))
    local keyword = compositeKey:match("keywords:(.+)$")

    -- 해당 통계의 참가자 집합 키 생성
    local setKey = "rooms:" .. roomId .. ":" .. compositeKey

    -- 참가자 ID 목록 검색
    local participants = redis.call('SMEMBERS', setKey)

    -- 각 참가자별 통계 처리
    for _, participantId in ipairs(participants) do
        -- 참가자 항목 초기화 (lazily)
        if not result[participantId] then
            result[participantId] = {}
        end

        -- 참가자 통계에 현재 질문/키워드 정보 추가
        table.insert(result[participantId], {
            questionId = questionId,
            keyword = keyword,
            count = participantCount
        })
    end
end

return cjson.encode(result)
