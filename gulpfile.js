const gulp = require('gulp');
//объединение файлов
const concat = require("gulp-concat");
// добавление префиксов
const autoprefixer = require("gulp-autoprefixer");
// оптимизация стилей
const cleanCSS = require("gulp-clean-css");
// оптимизация скриптов
const uglify = require("gulp-uglify");
// удаление файлов
const del = require('del');
// синхронизация с браузером
const browserSync = require('browser-sync').create();
// нужен для less
const sourcemaps = require('gulp-sourcemaps');
// подключение less
const less = require('gulp-less');

const rigger = require('gulp-rigger');

const imagemin = require('gulp-imagemin');
//стили css
/* const cssFiles = [
    './src/css/main.css',
    './src/css/header.css'
]; */
const cssFiles = [
    './src/css/style.less', 
];
const jsFiles = [
    './src/js/main.js'
];
function styles(){  
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist:['last 2 versions'],
        cascade: false
    }))
   
    //минификация
    .pipe(cleanCSS({level:2}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
}
//на скрипты
function scripts(){
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    //минификация
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}
function clean(){
    return del(['css/*'])
}
gulp.task('img-compress', ()=>{
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive:true
    }))
    .pipe(gulp.dest('./img/'))
})
gulp.task('html', function () {
    return gulp.src('*.html') //Выберем файлы по нужному пути
         .pipe(rigger()) //Прогоним через rigger
         .pipe(gulp.dest('build/')) //Выплюнем их в папку build
         .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
function watch(){
    browserSync.init({
        server: {
            baseDir: "."
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress')) 
    gulp.watch('./src/css/**/*less', styles)
    gulp.watch('./src/js/**/*js', scripts)
    /* gulp.watch("./*.html", gulp.series('html')).on('change', browserSync.reload); */
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch',watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'img-compress'), 'watch'));