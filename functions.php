<?php

require get_theme_file_path('/inc/search-route.php');

//this function is for customize a post type on the php rest api
function university_custom_rest() {
    register_rest_field('post', 'authorName', array(
        'get_callback' => function(){return get_the_author();}
    ));
}

add_action('rest_api_init','university_custom_rest');

function pageBanner($args = NULL){
   if(!$args['title']) {
      $args['title'] = get_the_title();
    }
    if(!$args['subtitle']) {
        $args['subtitle'] = get_field('page_banner_subtitle');
    }
    if(!$args['photo']){
        if(get_field('page_banner_background_image')){
            $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];   
        } else {
            $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
        } 
    }

   ?>
    <div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo'];  ?>);"></div>
    <div class="page-banner__content container container--narrow">
      <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
      <div class="page-banner__intro">
        <p><?php echo $args['subtitle'] ?></p>
      </div>
    </div>  
  </div>
<?php } 

function university_files() {
    wp_enqueue_script( 'googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyD7Zvtdq_e04207slnbUAL3fZ8-swdiJmM', null, '1.0', true );
    wp_enqueue_script( 'main-university-js', get_theme_file_uri('/js/scripts-bundled.js'), null, microtime(), true );
    wp_enqueue_style('custom-google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome','//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_stylesheet_uri(), null, microtime());
    wp_localize_script('main-university-js','universityData', array(
        'root_url' => get_site_url()
    ));

}

add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
    
    register_nav_menu('headerMenuLocation', 'Header Menu Location');
    register_nav_menu('footerLocationOne', 'Footer Location One');
    register_nav_menu('footerLocationTwo', 'Footer Location two');
    add_theme_support('title-tag'); 
    //support a feature image 
    add_theme_support('post-thumbnails'); 
    //create a copy of a feature image params are nickname, width, height, crop[true or false]
    add_image_size('professorLandscape',400, 260, true);
    add_image_size('professorPortrait',480, 650, true);
    add_image_size('pageBanner',1500, 350, true);

}

add_action( 'after_setup_theme', 'university_features' );

function university_adjust_queries($query) {
    if(!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()){
        $query->set('orderBy','title');
        $query->set('order','ASC');
        $query->set('posts_per_page',-1);
        
    }
    
    if(!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()){
        $today = date('Ymd');
        $query->set('meta_key','event_date');
        $query->set('orderBy','meta_value_num');
        $query->set('order','ASC');
        $query->set('meta_query',array(
            array(
              'key'=>'event_date',
              'compare'=>'>=',
              'value'=> $today,
              'type'=>'numeric'
            )
          ) );
    }

    if(!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()){
        $query->set('posts_per_page',-1);
        
    }
}

add_action('pre_get_posts','university_adjust_queries');

function universityMapKey($api){
    $api['key'] = 'AIzaSyD7Zvtdq_e04207slnbUAL3fZ8-swdiJmM';
    return $api;
}

add_filter('acf/fields/google_map/api', 'universityMapKey');




