import { useQuery } from "@tanstack/react-query";
import { getProfile, getAllAchievements } from "./actions";

export const GAMIFICATION_KEYS = {
  all: ["gamification"] as const,
  profile: () => [...GAMIFICATION_KEYS.all, "profile"] as const,
  achievements: () => [...GAMIFICATION_KEYS.all, "achievements"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: GAMIFICATION_KEYS.profile(),
    queryFn: () => getProfile(),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: GAMIFICATION_KEYS.achievements(),
    queryFn: () => getAllAchievements(),
  });
}
