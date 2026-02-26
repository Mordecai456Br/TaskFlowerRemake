type Schedule = {
    day: string;
    startTime: string;
    endTime: string;
};

type UserRoles = "admin" | "user";

type RateLimitRole = UserRoles | "guest";