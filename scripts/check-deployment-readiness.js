// Check if all deployment files are ready
const fs = require("fs")

console.log("🔍 Checking MAXimum Security Calculator Deployment Readiness...\n")

const requiredFiles = ["package.json", "Dockerfile", "docker-compose.yml", "deploy.sh", "next.config.mjs"]

const optionalFiles = ["healthcheck.js", "nginx.conf", ".dockerignore"]

let allReady = true

console.log("📋 Required Files:")
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allReady = false
  }
})

console.log("\n📋 Optional Files:")
optionalFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`⚠️  ${file} - Optional but recommended`)
  }
})

console.log("\n" + "=".repeat(50))

if (allReady) {
  console.log("🎉 All required files are present!")
  console.log("✅ Ready for deployment")

  console.log("\n🚀 To deploy:")
  console.log("1. Download this code")
  console.log("2. Open terminal in the project folder")
  console.log("3. Run: chmod +x deploy.sh")
  console.log("4. Run: ./deploy.sh")
} else {
  console.log("❌ Missing required files")
  console.log("Please ensure all required files are present before deployment")
}

// Show file contents summary
console.log("\n📊 Project Structure:")
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  console.log(`   Name: ${packageJson.name}`)
  console.log(`   Version: ${packageJson.version}`)
  console.log(`   Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`)
} catch (e) {
  console.log("   Could not read package.json details")
}
