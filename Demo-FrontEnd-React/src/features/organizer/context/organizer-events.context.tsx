import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import {
    fetchOrganizerEvents,
    publishOrganizerEvent,
    resolveOrganizerId,
    unpublishOrganizerEvent,
} from "../services/organizer-events.api";
import type { OrganizerEvent } from "../types/organizer-event.types";

type OrganizerEventsContextValue = {
    organizerId: number;
    events: OrganizerEvent[];
    isLoading: boolean;
    error: string | null;
    refreshEvents: () => Promise<void>;
    togglePublishStatus: (event: OrganizerEvent) => Promise<void>;
};

const OrganizerEventsContext = createContext<OrganizerEventsContextValue | null>(null);

export const OrganizerEventsProvider = ({ children }: { children: React.ReactNode }) => {
    const [events, setEvents] = useState<OrganizerEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const organizerId = useMemo(() => resolveOrganizerId(), []);

    const refreshEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const latest = await fetchOrganizerEvents(organizerId);
            setEvents(latest);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Khong the tai danh sach su kien.");
        } finally {
            setIsLoading(false);
        }
    }, [organizerId]);

    const togglePublishStatus = useCallback(
        async (event: OrganizerEvent) => {
            if (event.publishStatus === "PUBLISHED") {
                await unpublishOrganizerEvent(organizerId, event.eventId);
            } else {
                await publishOrganizerEvent(organizerId, event.eventId);
            }
            await refreshEvents();
        },
        [organizerId, refreshEvents],
    );

    useEffect(() => {
        void refreshEvents();
    }, [refreshEvents]);

    const value = useMemo<OrganizerEventsContextValue>(
        () => ({ organizerId, events, isLoading, error, refreshEvents, togglePublishStatus }),
        [organizerId, events, isLoading, error, refreshEvents, togglePublishStatus],
    );

    return <OrganizerEventsContext.Provider value={value}>{children}</OrganizerEventsContext.Provider>;
};

export const OrganizerEventsScope = () => {
    return (
        <OrganizerEventsProvider>
            <Outlet />
        </OrganizerEventsProvider>
    );
};

export const useOrganizerEvents = () => {
    const context = useContext(OrganizerEventsContext);
    if (!context) {
        throw new Error("useOrganizerEvents must be used inside OrganizerEventsProvider");
    }
    return context;
};
