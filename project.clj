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
  :main ^:skip-aot do-you-know-me.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
