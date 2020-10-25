(defproject do-you-know-me "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [proto-repl "0.3.1"]
                 [http-kit "2.4.0-alpha4"]
                 [org.clojure/data.json "0.2.6"]
                 [nano-id "0.10.0"]]
  :min-lein-version "2.0.0"
  :plugins [[environ/environ.lein "0.3.1"]]
  :hooks [environ.leiningen.hooks]
  :main ^:skip-aot do-you-know-me.web
  :target-path "target/%s"
  :uberjar-name "do-you-know-me-standalone.jar"
  :profiles {:production {:env {:production true}}
              :uberjar {:aot :all}})
