# TacSimulator

JavaScript製の[TaC](https://github.com/tctsigemura/TacOS)シミュレータです。

## インストール手順

### Node.jsインストール
下のリンクからNode.jsをインストールします。
https://nodejs.org/ja/

#### Homebrewを使ったインストール(Macユーザーのみ)
MacであればHomebrewを使ってもインストールできます。
```sh
$ brew install nodebrew
```

### TaCシミュレータのダウンロード
Gitをインストールしているのであれば、git cloneを使うのが楽です。
```sh
$ git clone https://github.com/TacSimTeam/TacSimulator.git
```

あるいは、ページ上部の緑のボタンから「Download ZIP」をクリックすることでダウンロードすることができます。

ターミナルで先程ダウンロードしたフォルダを開きます。

### このまま実行する
```
$ npx electron .
```

### 実行ファイルの作成
#### MacOS(x64)の場合
```
$ npm run build:mac
```
実行するには以下のコマンドを実行します。
```
$ open TacSimulator-darwin-x64/TacSimulator.app
```
Mac用のパッケージは/Application以下にコピーすればランチャーから起動できます。

#### Windowsの場合
```
$ npm run build:win
```
TacSimulator-win32-x64というフォルダが生成されるので、その中のTacSimulator.exeを実行すれば起動します。
