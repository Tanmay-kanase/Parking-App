package com.example.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.example.model.ParkingSlot;

@Repository
public class ParkingSlotRepositoryCustomImpl implements ParkingSlotRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public boolean lockSlot(String slotId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(slotId).and("isAvailable").is(true));

        Update update = new Update();
        update.set("isAvailable", false);

        var result = mongoTemplate.findAndModify(query, update, ParkingSlot.class);

        return result != null; // if null → already booked
    }
}