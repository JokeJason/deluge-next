# User Stories for Deluge Next

## Authentication
- [x] As a user, I want to log in securely to access the Deluge web interface
- [x] As a user, I want to log out to secure my session when I'm done
- [x] As a user, I want to authenticate using Clerk to leverage modern auth features
- [ ] As an admin, I want to control who has access to the Deluge interface

## Torrent Management
- [x] As a user, I want to view a list of all my torrents
- [ ] As a user, I want to add new torrents via magnet links
- [x] As a user, I want to upload torrent files directly
- [ ] As a user, I want to remove torrents with or without data
  - [x] As a user, I want to remove torrents with data
  - [ ] As a user, I want to remove torrents without data
- [x] As a user, I want to start/pause/resume individual torrents
- [ ] As a user, I want to start/pause/resume all torrents at once
- [x] As a user, I want to verify the integrity of torrents
- [x] As a user, I want to change the queue position of torrents
- [x] As a user, I want to see torrent download/upload speeds in real-time
- [ ] As a user, I want to see detailed information about each torrent

## Labels and Organization
- [x] As a user, I want to assign labels to torrents for better organization
- [x] As a user, I want to filter torrents by label
- [ ] As a user, I want to create, edit, and delete labels
- [x] As a user, I want to quickly update a torrent's label

## Files and Data
- [ ] As a user, I want to browse files within a torrent
- [ ] As a user, I want to see file sizes and download progress for individual files
- [ ] As a user, I want to prioritize specific files within a torrent

## User Interface
- [x] As a user, I want a responsive UI that works well on both desktop and mobile
- [x] As a user, I want to sort and filter the torrent list by various properties
- [ ] As a user, I want to receive notifications about completed downloads
- [x] As a user, I want to see visual indicators of download/upload status
- [ ] As a user, I want to customize which columns are displayed in the torrent table

## Settings and Configuration
- [ ] As a user, I want to configure global download/upload speed limits
- [ ] As a user, I want to configure connection settings for the Deluge daemon
- [ ] As a user, I want to view and change system settings without leaving the web UI
- [ ] As a user, I want to see statistics about overall download/upload activity
- [ ] As a user, I want to be able to reset deluge's password

## Technical and Performance
- [x] As a user, I want the UI to update in real-time without browser refreshes
- [x] As a user, I want the application to load quickly, even with many torrents
- [x] As a user, I want the UI to remain responsive during high server load
- [x] As a user, I want to access the application securely from outside my home network

## Integration
- [ ] As a developer, I want to extend the functionality with plugins