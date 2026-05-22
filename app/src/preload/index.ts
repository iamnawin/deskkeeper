import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('deskkeeper', {
  platform: process.platform,
})
