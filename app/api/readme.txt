// sql
    model Token 
        spl token address 
        name
        ticker 
        indexId  @realtion Index
        percent in this index 
        image
        mcap


    model Index
        spl token address 
        name
        ticker 
        tokens @relation Token[]
        curPrice

    model IndexChart
        spl token address
        curTimestamp
        price


// back

    1) каждый час обвноляем индекс чарт - там обновляется и цена токена
    2) подписываемся на контракт главного индекса и трекаем когда создается новый индекс
    3) валидация формы и валидация токенов

// api 
    1) список индексов
    2) график индекса 
    3) 

