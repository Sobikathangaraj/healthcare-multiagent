import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080" });

export const greetUser    = (userId)              => api.get(`/greet/${userId}`);
export const logMood      = (userId, mood)        => api.post("/mood",      { user_id: userId, mood });
export const logCGM       = (userId, glucose)     => api.post("/cgm",       { user_id: userId, glucose: parseFloat(glucose) });
export const logFood      = (userId, meal, ts)    => api.post("/food",      { user_id: userId, meal, timestamp: ts || null });
export const getMealPlan  = (userId)              => api.get(`/meal-plan/${userId}`);
export const askInterrupt = (query, flow)         => api.post("/interrupt",  { query, current_flow: flow || "main" });
export const getUsers     = ()                    => api.get("/users");
export const getCGMHist   = (userId, limit = 7)  => api.get(`/history/cgm/${userId}?limit=${limit}`);
export const getMoodHist  = (userId, limit = 7)  => api.get(`/history/mood/${userId}?limit=${limit}`);
export const getFoodHist  = (userId, limit = 10) => api.get(`/history/food/${userId}?limit=${limit}`);
