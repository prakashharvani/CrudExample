"use strict";

//========================== Class Definitions Start =====================

class BaseDao {
    constructor(dbModel) {
        //Get Model
        this.Model = dbModel;
    }

    save(object) {
        return this.Model.create(object);
    }

    findOne(query, projection) {
        return this.Model.findOne(query, projection).exec();
    }

    find(query, projection) {
        return this.Model.find(query, projection).exec();

    }
    findSkipLimit(query, option) {
        return this.Model.find(query).skip(option.skip).limit(option.limit).exec();

    }
    findSorting(query, condition) {
        return this.Model.find(query).sort(condition).exec();
    }

    findSortingProject(query, projection, condition) {
        return this.Model.find(query, projection).sort(condition).exec();
    }

    findOneAndUpdate(query, update, options) {
        return this.Model.findOneAndUpdate(query, update, options).exec();
    }

    findAndModify(query, update, options) {
        return this.Model.findAndModify(query, update, options).exec();
    }

    findWithPeginate(query, options) {
        return this.Model.paginate(query, options);
    }

    findSortingAndLimit(query, condition,limit) {
        return this.Model.find(query).limit(limit).sort(condition).exec();
    }

    dropIndex(query) {
        return this.Model.dropIndex(query).exec();
    }
    /**
     * Update Given Model
     * @param query
     * @param toUpdate
     * @return Promise Object
     * @private
     */
        update(query, update, options) {
        if (!options) {
            options = {};
        }
        return this.Model.update(query, update, options).exec();
    }

    remove(query, options) {
        return this.Model.remove(query, options).exec();
    }

    findByIdAndRemove(query, options) {
        return this.Model.findByIdAndRemove(query, options).exec();
    }

    aggregate(aggPipe) {
        return this.Model.aggregate(aggPipe).exec();
    }

    count(query, options) {
        return this.Model.countDocuments(query, options).exec();
    }

    findByIdAndUpdate(query, options) {
        return this.Model.findByIdAndUpdate(query, options).exec();
    }

}

module.exports = BaseDao;
