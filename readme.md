10-1-25

    - login and register route          -- done
    - create service jwt                -- done
    - create authentication middleware  -- done
    - design accounting table           -- done
    - create accounting route           
        - delete accouning endpoint     -- done
        - create accointing endpoint    -- done

11-1-25

    - design transaction table                                          -- done
    - create tb_transaction_type                                        -- done
    - create transaction route      
        - create transaction                                            -- done
        - delete transaction                                            -- done
        - create upload slip                                            -- done
        - create and design folder and path to save transaction slip    -- done
    - create detect profanity string service                            -- done
    - fix created_at, updated_at in database                            -- done

12-1-25

    - create method remove file                                         -- done
    - fix sql => in get data endpoint must start with tb_accounting and then find transaction *** start with userId     -- done
    - when create transaction must affect to balance in tb_account      -- done

13-1-25

    - map response in get data          -- in progress
    - if delete accounting => The transaction and slip will be deleted      -- done
    - create transaction fail but slip is saved         -- will fix it later
    - create and design total summary   -- in progress
