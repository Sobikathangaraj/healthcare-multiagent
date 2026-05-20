import { useState, useCallback } from "react";
import * as api from "../utils/api";
import toast from "react-hot-toast";

export function useAgent() {
  const [user, setUser]           = useState(null);
  const [userId, setUserId]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "👋 Hi! Enter your User ID on the left to get started." }
  ]);

  // CGM chart data
  const [cgmHistory, setCgmHistory] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);

  const addMsg = useCallback((role, text) => {
    setChatMessages(prev => [...prev, { role, text }]);
  }, []);

  // ── Greeting ──────────────────────────────────────────────
  const handleGreet = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.greetUser(id);
      if (data.success) {
        setUser(data.user);
        addMsg("assistant", data.message);
        // Load chart history
        const [cgm, mood] = await Promise.all([
          api.getCGMHist(id),
          api.getMoodHist(id),
        ]);
        setCgmHistory(cgm.data.cgm_history.reverse());
        setMoodHistory(mood.data.mood_history.reverse());
        toast.success(`Welcome, ${data.user.name}!`);
      } else {
        addMsg("assistant", data.message);
        toast.error(data.message);
      }
    } catch {
      toast.error("Backend unreachable. Is the server running on :8000?");
    } finally {
      setLoading(false);
    }
  }, [addMsg]);

  // ── Mood ─────────────────────────────────────────────────
  const handleMood = useCallback(async (mood) => {
    if (!user) return toast.error("Please login first.");
    setLoading(true);
    try {
      const { data } = await api.logMood(user.id, mood);
      addMsg("user", `My mood: ${mood}`);
      addMsg("assistant", data.message);
      const { data: mh } = await api.getMoodHist(user.id);
      setMoodHistory(mh.mood_history.reverse());
      toast.success("Mood logged!");
    } catch { toast.error("Failed to log mood."); }
    finally { setLoading(false); }
  }, [user, addMsg]);

  // ── CGM ──────────────────────────────────────────────────
  const handleCGM = useCallback(async (glucose) => {
    if (!user) return toast.error("Please login first.");
    setLoading(true);
    try {
      const { data } = await api.logCGM(user.id, glucose);
      addMsg("user", `Glucose reading: ${glucose} mg/dL`);
      addMsg("assistant", data.message);
      const { data: ch } = await api.getCGMHist(user.id);
      setCgmHistory(ch.cgm_history.reverse());
      if (data.alert && data.glucose > 180) toast.error(data.alert);
      else if (data.alert && data.glucose < 100) toast(data.alert, { icon: "🟡" });
      else toast.success("CGM logged!");
    } catch { toast.error("Failed to log glucose."); }
    finally { setLoading(false); }
  }, [user, addMsg]);

  // ── Food ─────────────────────────────────────────────────
  const handleFood = useCallback(async (meal) => {
    if (!user) return toast.error("Please login first.");
    setLoading(true);
    try {
      const { data } = await api.logFood(user.id, meal);
      addMsg("user", `Logged meal: ${meal}`);
      addMsg("assistant", `${data.message}\n\n📊 ${data.analysis}`);
      toast.success("Meal logged!");
    } catch { toast.error("Failed to log meal."); }
    finally { setLoading(false); }
  }, [user, addMsg]);

  // ── Meal Plan ────────────────────────────────────────────
  const handleMealPlan = useCallback(async () => {
    if (!user) return toast.error("Please login first.");
    setLoading(true);
    try {
      const { data } = await api.getMealPlan(user.id);
      addMsg("user", "Generate my meal plan");
      addMsg("assistant", `🍽️ Here's your personalised meal plan:\n\n${data.meal_plan}`);
      toast.success("Meal plan ready!");
      return data;
    } catch { toast.error("Failed to generate meal plan."); }
    finally { setLoading(false); }
  }, [user, addMsg]);

  // ── Interrupt ────────────────────────────────────────────
  const handleInterrupt = useCallback(async (query) => {
    if (!query.trim()) return;
    addMsg("user", query);
    setLoading(true);
    try {
      const { data } = await api.askInterrupt(query, activeTab);
      addMsg("assistant", data.answer);
    } catch { addMsg("assistant", "Sorry, couldn't process that right now."); }
    finally { setLoading(false); }
  }, [activeTab, addMsg]);

  return {
    user, userId, setUserId,
    loading, activeTab, setActiveTab,
    chatMessages,
    cgmHistory, moodHistory,
    handleGreet, handleMood, handleCGM,
    handleFood, handleMealPlan, handleInterrupt,
  };
}
