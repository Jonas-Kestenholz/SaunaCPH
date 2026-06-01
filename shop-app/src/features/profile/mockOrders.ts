import { ProfileOrder } from "./types";

export const currentOrder: ProfileOrder = {
  id: "order-1",
  carrier: "DAO",
  trackingNumber: "00057151273606671265",
  status: "På vej til daoSHOP",
  updatedAt: "14. apr. 2026 08:14:48",
  steps: [
    {
      label: "Oprettet",
      description: "Forsendelse er oprettet",
      date: "12. apr. 2026 10:23:19",
      completed: true,
    },
    {
      label: "Sorteret",
      description: "Pakken er sorteret på terminal",
      date: "14. apr. 2026 01:36:39",
      completed: true,
    },
    {
      label: "På vej",
      description: "Pakken er på vej til daoSHOP",
      date: "14. apr. 2026 08:14:48",
      completed: true,
    },
    {
      label: "Klar",
      description: "Klar til afhentning",
      date: "",
      completed: false,
    },
    {
      label: "Leveret",
      description: "Pakken er udleveret",
      date: "",
      completed: false,
    },
  ],
};