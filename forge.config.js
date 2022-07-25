module.exports = {
    packagerConfig: {
        name: 'Print',
        executableName: 'Print',
        asar: true
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            platforms: [
                "win32"
            ],
            config: {
                name: 'MyApp',
                description: 'The worlds most boring app.',
                version: '1.1.4'
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin', "win32"
            ]
        }
    ]
}