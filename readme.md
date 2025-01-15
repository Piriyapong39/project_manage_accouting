10-1-25

    - login and register route                                              -- done
    - create service jwt                                                    -- done
    - create authentication middleware                                      -- done
    - design accounting table                                               -- done
    - create accounting route           
        - delete accouning endpoint                                         -- done
        - create accointing endpoint                                        -- done

11-1-25

    - design transaction table                                              -- done
    - create tb_transaction_type                                            -- done
    - create transaction route      
        - create transaction                                                -- done
        - delete transaction                                                -- done
        - create upload slip                                                -- done
        - create and design folder and path to save transaction slip        -- done
    - create detect profanity string service                                -- done
    - fix created_at, updated_at in database                                -- done

12-1-25

    - create method remove file                                             -- done
    - fix sql => in get data endpoint                                       -- done
    - when create transaction must affect to balance in tb_account          -- done

13-1-25

    - map response in get data                                              -- done
    - if delete accounting => The transaction and slip will be deleted      -- done     
    - create and design total summary                                       -- done
    - ignore get transaction endpoint                                       -- done
    - average using money per day                                           -- done
    - total balance                                                         -- done
    

14-1-25

    - create import exel function                                           -- done
    - creat export exel function                                            -- done
    - create dockerfile                                                     -- done

15-1-25

    - fix sql logic in export transaction                                   -- done
    - test all check list                     
        - login register system                                             -- done
        - create and delete accounting system                               -- done
        - create and delete transaction system                              -- done
        - summary system
        - filter trasnsction by 
            transaction_id,                                                 -- done
            date,                                                           -- done
            month,                                                          -- done
            year, 
            startTime - endTime,                                            -- done
            type_of_transaction,                                            -- done
            accouting
        - import transaction slip system                                    -- done
        - censor badword system                                             -- done
        - api list must return in pagination type
            - in accouting route return 10 rows                             -- done                      
            - in transaction route 50 rows                                  -- done
        - config => .env                                                    -- done
        - validation all query                                              -- done
        - export transaction system                                         -- done
        - import transaction system                                         -- done
        - summary total balance and calculate average spend money per day   -- done
        - test docker
    
        

        