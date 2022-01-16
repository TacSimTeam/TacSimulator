# TacSimulator

## このまま実行する．
```
$ npx electron .
```

## Mac用のパッケージを作る．
```
$ npx electron-packager . TacSimulator --platform=darwin --arch=x64 --overwrite
```

## Mac用のパッケージを実行する．
```
$ open TacSimulator-darwin-x64/TacSimulator.app
```
（M1 Macだと初回実行時は起動に時間がかかる）

## Macにインストールする．

Mac用のパッケージは/Application以下にコピーすればランチャーから起動できる．

