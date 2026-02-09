
const {Queue} = require("bullmq");
const connection = require("./redis");

const applicationQueue = new Queue("job-applications" , {
    connection,
    defaultJobOptions : {
        attempts : 3,
        backoff : {
            type : "exponential",
            delay : 2000,
        },
        removeOnComplete : true,
        removeOnFail : false,
    },
});

module.exports = applicationQueue;