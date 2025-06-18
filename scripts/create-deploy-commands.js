console.log("📜 CREATING YOUR DEPLOYMENT COMMANDS")
console.log("===================================")
console.log("")

const deployCommands = {
  preview: "vercel",
  production: "vercel --prod",
  status: "vercel ls",
  logs: "vercel logs",
  domains: "vercel domains ls",
}

console.log("💾 SAVE THESE COMMANDS:")
console.log("")

Object.entries(deployCommands).forEach(([name, command]) => {
  console.log(`${name.toUpperCase()}:`)
  console.log(`   ${command}`)
  console.log("")
})

console.log("🔧 USEFUL VERCEL COMMANDS:")
console.log("   vercel --help          # Show all commands")
console.log("   vercel env ls          # List environment variables")
console.log("   vercel inspect [url]   # Get deployment details")
console.log("   vercel rm [project]    # Remove project")
console.log("")

console.log("🎯 QUICK DEPLOYMENT WORKFLOW:")
console.log("   1. Download code from v0")
console.log("   2. cd max-security-calculator")
console.log("   3. vercel --prod")
console.log("   4. 🎉 Your app is live!")
