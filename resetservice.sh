pm2 stop openshadowdark
pm2 delete openshadowdark
pm2 save
rm -rf ~/apps/open-shadowdark
mkdir -p ~/apps/open-shadowdark
cp -r ~/actions-runner/_work/open-shadowdark/* ~/apps/open-shadowdark
cd ~/apps/open-shadowdark
pm2 start open-shadowdark/src/app.js --name openshadowdark
pm2 save
