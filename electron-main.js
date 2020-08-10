const Hyperupdate = require('hyperupdate')
const { BrowserWindow, app, dialog } = require('electron')

main().catch(err => {
  console.error(err.stack)
  process.exit(1)
})

async function updater () {
  const u = new Hyperupdate({
    darwin: '4333f8dc3bae7b2a5c91b7928fdf0c6d54f86db277758ed6970506439599af5d',
    linux: '8b30f91f4255c48308be7c7eabb08d1f27cb9022de547b0b3efd07153e6cbb3b',
    win32: '7bc8753f96fac52c2d2eac11fb9c5a2edaef6b1133ac1f7c80497c78b905230d',
  })

  while (true) {
    const latestRelease = await u.nextUpdate()

    if (!(await u.isUpdateDownloaded())) {
      const shouldDownload = await dialog.showMessageBox({
        title: 'Update available',
        message: `Update v${latestRelease.version} is available`,
        defaultId: 0,
        buttons: ['Download update', 'Remind me later']
      })

      if (shouldDownload.response === 1) continue
    }

    await u.downloadUpdate()

    const shouldUpdate = await dialog.showMessageBox({
      title: 'Update downloaded',
      message: `v${latestRelease.version} has been fully downloaded`,
      defaultId: 0,
      buttons: ['Restart and update now', 'Remind me later']
    })

    if (shouldUpdate.response === 1) continue

    u.updateAndRelaunch()
    return
  }
}

async function main () {
  app.setName('Update Bootstrap')

  await app.whenReady()

  await updater()
}

