const AvailableTasksPage = () => {
  return (
    <div>
      <h1>Available Tasks</h1>
      {/* Example of platform logo with error handling */}
      <div>
        <img
          src="/images/platform-logo.png" // Ensure leading slash
          alt="Platform Logo"
          onError={(e) => {
            console.error("Error loading image:", e)
            ;(e.target as HTMLImageElement).src = "/images/default-logo.png" // Fallback image
          }}
        />
      </div>
      {/* Rest of the page content */}
    </div>
  )
}

export default AvailableTasksPage
