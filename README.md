# Foul

## スタティックな SPA をエンパワーする「反則」ブラウザー

![Foul ホーム画面](https://raw.githubusercontent.com/wiki/takahashihideki-git/Foul/images/foulHome.png)

Foul は、[Electron](http://electron.atom.io/) でつくられた Mac と Windows で動作する Web ブラウザーです。静的な HTML, CSS, Javascript ファイルのみで構成された SPA (Single Page Application) の可能性を最大限に引き出すために、一般的な Web ブラウザーとは異なるセキュリティポリシーの下で各種のリソースにアクセスします。

1. Cross-Origin XMLHttpRequest

   XMLHttpRequest は、いわゆる「同一生成元ポリシー」の制約を受けません。

2. ローカルファイルへのアクセス

   ブラウザにロードされたリソースが次のいずれかの条件に合致する場合、当該のリソースから window.fileSyemte オブジェクトを通じてローカルファイルにアクセスすることができます。

   * file:プロトコルでリクエストされたローカルファイル

   * ホーム画面にショートカット(＊)が作成された URL

    ＊ アドレス欄の右にある「＋」ボタンをクリックすると、表示中のURLのショートカットがホーム画面に追加されます。

たとえば、

二つの任意のURLを指定して、双方の HTML コードの差分を検出する[小さなアプリケーション](http://www.takahashihideki.net/dev/Mergely/examples/crossOrigin.html)（[jQuery](https://jquery.com/) + [CodeMIrror](https://codemirror.net/) + [mergery](https://github.com/wickedest/Mergely) + 約140行の静的なHTMLファイル）。

あるいは、

ローカルディスクに保存されている markdownファイルの編集とプレビューを行う[小さなアプリケーション](https://dl.dropboxusercontent.com/u/223789/dev/markdownEditor.html)（[marked.js](https://github.com/chjj/marked) + 約150行の静的なHTMLファイル）。

これらは、一般的な Web ブラウザーではセキュリティ上の制約から正しく動作しません。しかし、Foul ではユーザーと開発者の期待どおりに動作します。

Foul が、このような「反則」を敢えて犯すのは、信頼する特定の Single Page Application の利用に用途を限るのであれば、一般的な Web ブラウザーが前提にせざるをえない、悪意を隠し持った未知のリソースの存在を、ユーザーの自己責任において、無視しても差し支えはないと考えるからです。

従来、このような「小さなアプリケーション」（ときには「使い捨てのアプリケーション」）を実現する場合でも、専用の Web サーバーを用意したり、それ自体をデスクトップアプリケーションとして実装する必要がありましたが、Foul があれば、 静的な HTML, CSS, Javascript ファイルを記述するだけで済むようになります。

## Download

Mac 版とWindows 版のプレビルドのバイナリーは[リリースページ](https://github.com/takahashihideki-git/Foul/releases/)からダウンロードしてください。

