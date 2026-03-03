import { useEffect, useRef, useState } from "react"

// ----------------------------------------------------------------------

export function useFilePreview(file: File | string | null) {
  const objectUrlRef = useRef<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    // Cleanup old object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file)
      objectUrlRef.current = objectUrl
      setPreviewUrl(objectUrl)
    } else if (typeof file === "string") {
      setPreviewUrl(file)
    } else {
      setPreviewUrl("")
    }

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [file])

  return {
    previewUrl,
    setPreviewUrl,
  }
}

// ----------------------------------------------------------------------

export function revokeObjectUrls(urls: string[]) {
  urls.forEach((url) => URL.revokeObjectURL(url))
}

export function useFilesPreview(files: (File | string)[]) {
  const objectUrlsRef = useRef<string[]>([])
  const [filesPreview, setFilesPreview] = useState<{ file: File | string; previewUrl: string }[]>([])

  useEffect(() => {
    // Cleanup old object URLs
    revokeObjectUrls(objectUrlsRef.current)
    objectUrlsRef.current = []

    const previews = files.map((file) => {
      const isFile = file instanceof File
      const previewUrl = isFile ? URL.createObjectURL(file) : file

      if (isFile) objectUrlsRef.current.push(previewUrl)

      return {
        file,
        previewUrl,
      }
    })

    setFilesPreview(previews)

    return () => {
      revokeObjectUrls(objectUrlsRef.current)
      objectUrlsRef.current = []
    }
  }, [files])

  return {
    filesPreview,
    setFilesPreview,
  }
}
