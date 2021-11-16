# Cac buoc download theme bang shopify CLI
- 1.Cai đặt shopify cli: gem install shopify-cli sau đó check version xem đã cài được hay chưa
- 2.shopify theme pull và lựa chọn theme cần pull về ( shopify login --store johns-apparel.myshopify.com - login store)
- 3.configure theme để chạy theme kit
+ theme -v
+ theme configure --store=the-club-digitaloutlook.myshopify.com --themeid=127598231730 --password=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
- 4.Create package.json and install themekit https://www.npmjs.com/package/@shopify/themekit
- 5.Install Gulpjs https://gulpjs.com/docs/en/getting-started/quick-start
+ npm -g install gulp-cli
+ npm install --save-dev gulp
+ seup gulp-sass: npm install sass gulp-sass --save-dev ( cd folder and run with powershell )
- 6.Run gulp watch
- 7.Clean scss run witch CMD "npm install gulp-clean-css --save-dev" => gulp sass or gulp watch follow config file gulpfile.js
# Note install gem if has error cannot load such file -- wdm
- gem install wdm
# Bug shopify env
Step 1 install:
https://rubyinstaller.org/downloads/
https://git-scm.com/downloads

Step 2:

right click ‘My Computer’ or ‘This PC’ then select ‘Properties’
left click ‘Advanced system settings’
click/open ‘Advanced’ tab
click ‘Environmental Variables’
under ‘User variables for [username] click ‘New’
then type ‘SHOPIFY_CLI_STACKTRACE’ in the ‘Variable Name’
and type ‘1’ on the ‘Variable Value’
under ‘System variables’ do the same as 6 & 7
Step 3 using cmd type or copy+paste the text below: (source: https://shopify.dev/themes/tools/cli)
gem install shopify-cli
gem install wdm

Step 4
Congratulations you’re good to go!

💻 HAPPY CODING!!! ❤️
