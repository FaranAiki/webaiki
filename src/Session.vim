let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Git/webaiki/src
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +90 ./components/AskMePopup.tsx
badd +20 ./components/Header.tsx
badd +16 ../README.md
badd +1 ../LICENSE
badd +34 app/layout.tsx
badd +1 ./app/page.tsx
badd +36 ./components/AboutMe.tsx
badd +0 LICENSE
badd +38 ./components/Background.tsx
badd +28 ./components/HoverableWords.tsx
argglobal
%argdel
$argadd ./components/AskMePopup.tsx
$argadd ./components/Header.tsx
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit ../README.md
argglobal
if bufexists(fnamemodify("../README.md", ":p")) | buffer ../README.md | else | edit ../README.md | endif
if &buftype ==# 'terminal'
  silent file ../README.md
endif
balt ../LICENSE
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 28 - ((27 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 28
normal! 064|
tabnext
edit ./components/HoverableWords.tsx
argglobal
if bufexists(fnamemodify("./components/HoverableWords.tsx", ":p")) | buffer ./components/HoverableWords.tsx | else | edit ./components/HoverableWords.tsx | endif
if &buftype ==# 'terminal'
  silent file ./components/HoverableWords.tsx
endif
balt ./components/AboutMe.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 28 - ((27 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 28
normal! 0
tabnext 2
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
