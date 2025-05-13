"use client"

import { useState } from "react"
import { Bell, Clock, Filter, MessageSquare, Search, Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "New message from Alex",
    description: "Hey, I've completed the frontend for the user dashboard. Can you review it?",
    time: "10 minutes ago",
    read: false,
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    iconBg: "bg-green-500/10",
  },
  {
    id: 2,
    type: "task",
    title: "Task status updated",
    description: '"API Integration" was marked as completed',
    time: "1 hour ago",
    read: false,
    icon: <Zap className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-500/10",
  },
  {
    id: 3,
    type: "deadline",
    title: "Task deadline approaching",
    description: '"User Authentication" is due in 2 days',
    time: "Yesterday",
    read: false,
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    iconBg: "bg-amber-500/10",
  },
  {
    id: 4,
    type: "message",
    title: "New message from Sarah",
    description: "I've pushed the latest changes to the repository. Let me know what you think!",
    time: "2 days ago",
    read: true,
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    iconBg: "bg-green-500/10",
  },
  {
    id: 5,
    type: "task",
    title: "New task assigned",
    description: 'You have been assigned to "Database Schema Design"',
    time: "3 days ago",
    read: true,
    icon: <Zap className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-500/10",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["message", "task", "deadline"])

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter(
    (notification) =>
      selectedTypes.includes(notification.type) &&
      (notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const toggleNotificationRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: !notification.read,
            }
          : notification,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with messages, tasks, and deadlines</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {selectedTypes.length < 3 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("message")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "message"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "message"))
                }
              }}
            >
              Messages
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("task")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "task"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "task"))
                }
              }}
            >
              Tasks
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("deadline")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "deadline"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "deadline"))
                }
              }}
            >
              Deadlines
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${
                        !notification.read ? "bg-muted/20" : ""
                      }`}
                      onClick={() => toggleNotificationRead(notification.id)}
                    >
                      <div className={`${notification.iconBg} p-2 rounded-full mr-4 mt-0.5`}>{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {!notification.read && <Badge className="ml-2">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No notifications found</h3>
                  <p className="text-muted-foreground mt-1">
                    {notifications.length === 0
                      ? "You have no notifications at the moment."
                      : "No notifications match your current filters."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unread">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.filter((n) => !n.read).length} unread notification
                {filteredNotifications.filter((n) => !n.read).length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredNotifications.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start p-4 hover:bg-muted/50 cursor-pointer bg-muted/20"
                        onClick={() => toggleNotificationRead(notification.id)}
                      >
                        <div className={`${notification.iconBg} p-2 rounded-full mr-4 mt-0.5`}>{notification.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <Badge className="ml-2">New</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No unread notifications</h3>
                  <p className="text-muted-foreground mt-1">You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
