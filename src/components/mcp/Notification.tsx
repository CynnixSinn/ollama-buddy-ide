
import { useEffect, useState } from "react";
import { useModelContext } from "@/context/ModelContext";
import { toast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";

/**
 * Notification component that handles sending notifications to the user
 * This is a mock implementation for demonstration purposes
 */
export const useNotifications = () => {
  const { mcpServers } = useModelContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  useEffect(() => {
    const notificationServer = mcpServers.find(server => server.id === "notification");
    setNotificationsEnabled(notificationServer?.enabled || false);
    
    if (notificationServer?.enabled) {
      // Register notification service
      console.log("Notification MCP server enabled");
      
      // Mock notification to demonstrate functionality
      setTimeout(() => {
        sendNotification("Notification Service Active", "The notification MCP server is now running and can send alerts to your mobile device.");
      }, 2000);
    }
  }, [mcpServers]);
  
  const sendNotification = (title: string, message: string, priority: "low" | "normal" | "high" = "normal") => {
    if (!notificationsEnabled) {
      console.warn("Notifications are disabled");
      return false;
    }
    
    // Simulate sending an external notification
    console.log(`Sending notification: ${title} - ${message} (${priority})`);
    
    // Show in-app notification
    toast({
      title: (
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2 text-accent" />
          {title}
        </div>
      ),
      description: message,
    });
    
    return true;
  };
  
  return {
    sendNotification,
    notificationsEnabled
  };
};
