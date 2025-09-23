import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const resumeData = await request.json()
    
    // Path to resume.json
    const filePath = path.join(process.cwd(), 'data', 'resume.json')
    
    // Write the updated data to resume.json
    fs.writeFileSync(filePath, JSON.stringify(resumeData, null, 2), 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resume data saved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error saving resume data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save resume data' },
      { status: 500 }
    )
  }
}
