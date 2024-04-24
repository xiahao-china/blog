module.exports = {
    projectName: 'YourProjectName',
    // privateKey: '',
    // passphrase: '',
    readyTimeout: 20000,
    cluster: [],
    dev: {
      name: '开发环境',
      script: 'pnpm run build',
      host: '47.110.158.92',
      port: 22,
      username: 'root',
      password: 'Yangyang01.',
      distPath: './activityDist',
      webDir: '/home/h5-server/distFiles/mobile-test',
      bakDir: '/home/h5-server/distFiles/mobile-test/back',
      isRemoveRemoteFile: true,
      isRemoveLocalFile: true
    }
}
