import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface User {
  id: string
  name: string
  score: number
  avatar?: string
  rank?: number
  trend?: "up" | "down" | "stable"
  department?: string
}

@Component({
  selector: "app-user-leaderboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-leaderboard.component.html",
  styleUrls: ["./user-leaderboard.component.css"],
})
export class UserLeaderboardComponent implements OnInit {
  users: User[] = []
  filteredUsers: User[] = []
  searchTerm = ""
  sortBy = "rank"
  sortOrder: "asc" | "desc" = "asc"
  departmentFilter = "all"
  departments: string[] = []

  ngOnInit(): void {
    // Mock data - would normally come from a service
    this.users = [
      {
        id: "1",
        name: "Sophie Martin",
        score: 980,
        avatar: "https://i.pravatar.cc/150?img=1",
        department: "Marketing",
      },
      { id: "2", name: "Thomas Dubois", score: 856, avatar: "https://i.pravatar.cc/150?img=2", department: "Design" },
      { id: "3", name: "Emma Leroy", score: 842, avatar: "https://i.pravatar.cc/150?img=3", department: "Development" },
      {
        id: "4",
        name: "Lucas Bernard",
        score: 812,
        avatar: "https://i.pravatar.cc/150?img=4",
        department: "Marketing",
      },
      { id: "5", name: "Chloé Petit", score: 795, avatar: "https://i.pravatar.cc/150?img=5", department: "Design" },
      { id: "6", name: "Noah Richard", score: 756, avatar: "https://i.pravatar.cc/150?img=6", department: "Finance" },
      {
        id: "7",
        name: "Jade Moreau",
        score: 738,
        avatar: "https://i.pravatar.cc/150?img=7",
        department: "Development",
      },
      { id: "8", name: "Louis Robert", score: 724, avatar: "https://i.pravatar.cc/150?img=8", department: "HR" },
      { id: "9", name: "Manon Simon", score: 703, avatar: "https://i.pravatar.cc/150?img=9", department: "Sales" },
      {
        id: "10",
        name: "Hugo Gautier",
        score: 695,
        avatar: "https://i.pravatar.cc/150?img=10",
        department: "Marketing",
      },
      {
        id: "11",
        name: "Léa Blanc",
        score: 682,
        avatar: "https://i.pravatar.cc/150?img=11",
        department: "Development",
      },
      {
        id: "12",
        name: "Gabriel Durand",
        score: 675,
        avatar: "https://i.pravatar.cc/150?img=12",
        department: "Design",
      },
    ]

    // Assign ranks and trends
    this.assignRanks()

    // Extract unique departments for filter
    this.departments = [...new Set(this.users.map((user) => user.department || ""))]

    // Initialize filtered users
    this.applyFilters()
  }

  assignRanks(): void {
    // Sort by score (descending) to determine rank
    const sortedUsers = [...this.users].sort((a, b) => b.score - a.score)

    // Assign ranks
    sortedUsers.forEach((user, index) => {
      user.rank = index + 1

      // Assign mock trends - in a real app, you'd compare to previous rankings
      const randomTrend = Math.floor(Math.random() * 3)
      user.trend = randomTrend === 0 ? "up" : randomTrend === 1 ? "down" : "stable"
    })
  }

  applyFilters(): void {
    // Start with all users
    let result = [...this.users]

    // Apply search filter if there's a search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          (user.department && user.department.toLowerCase().includes(search)),
      )
    }

    // Apply department filter
    if (this.departmentFilter !== "all") {
      result = result.filter((user) => user.department === this.departmentFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      if (this.sortBy === "rank") {
        comparison = (a.rank || 0) - (b.rank || 0)
      } else if (this.sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (this.sortBy === "score") {
        comparison = a.score - b.score
      } else if (this.sortBy === "department") {
        comparison = (a.department || "").localeCompare(b.department || "")
      }

      return this.sortOrder === "asc" ? comparison : -comparison
    })

    this.filteredUsers = result
  }

  search(): void {
    this.applyFilters()
  }

  setSortBy(field: string): void {
    if (this.sortBy === field) {
      // Toggle sort order if clicking on the same field
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc"
    } else {
      this.sortBy = field
      // Default to appropriate sort order based on field
      this.sortOrder = field === "rank" || field === "score" ? "asc" : "asc"
    }

    this.applyFilters()
  }

  setDepartmentFilter(department: string): void {
    this.departmentFilter = department
    this.applyFilters()
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) {
      return "fa-sort"
    }
    return this.sortOrder === "asc" ? "fa-sort-up" : "fa-sort-down"
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case "up":
        return "fa-arrow-up"
      case "down":
        return "fa-arrow-down"
      default:
        return "fa-minus"
    }
  }

 

  getRankClass(rank: number): string {
    if (rank <= 3) return `rank-top-${rank}`
    return ""
  }

  // Helper methods to get top 3 users for podium
  getFirstPlace(): User | null {
    return this.users.find((user) => user.rank === 1) || null
  }

  getSecondPlace(): User | null {
    return this.users.find((user) => user.rank === 2) || null
  }

  getThirdPlace(): User | null {
    return this.users.find((user) => user.rank === 3) || null
  }
}
