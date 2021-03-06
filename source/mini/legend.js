Bluff.Mini.Legend = new JS.Module({
  
  hide_mini_legend: false,
  
  // The canvas needs to be bigger so we can put the legend beneath it.
  _expand_canvas_for_vertical_legend: function() {
    if (this.hide_mini_legend) return;
    
    this._legend_labels = Bluff.map(this._data, function(item) {
      return item[this.klass.DATA_LABEL_INDEX];
    }, this);
    
    var legend_height = this._scale_fontsize(
                          this._data.length * this._calculate_line_height() +
                          this.top_margin + this.bottom_margin);
    
    this._original_rows = this._raw_rows;
    this._original_columns = this._raw_columns;
    
    switch (this.legend_position) {
      case 'right':
        this._rows = Math.max(this._rows, legend_height);
        this._columns += this._calculate_legend_width() + this.left_margin;
        break;
      
      default:
        this._rows += legend_height;
        break;
    }
    this._render_background();
  },
  
  _calculate_line_height: function() {
    return this._calculate_caps_height(this.legend_font_size) * 1.7;
  },
  
  _calculate_legend_width: function() {
    var width = 0;
    Bluff.each(this._legend_labels, function(label) {
      width = Math.max(this._calculate_width(this.legend_font_size, label), width);
    }, this);
    return this._scale_fontsize(width + 40*1.7);
  },
  
  // Draw the legend beneath the existing graph.
  _draw_vertical_legend: function() {
    if (this.hide_mini_legend) return;
    
    var legend_square_width = 40.0, // small square with color of this item
        legend_square_margin = 10.0,
        legend_left_margin = 100.0,
        legend_top_margin = 40.0;
    
    // May fix legend drawing problem at small sizes
    if (this.font) this._d.font = this.font;
    this._d.pointsize = this.legend_font_size;
    
    var current_x_offset, current_y_offset;
    
    switch (this.legend_position) {
      case 'right':
        current_x_offset = this._original_columns + this.left_margin;
        current_y_offset = this.top_margin + legend_top_margin;
        break;
      
      default:
        current_x_offset = legend_left_margin,
        current_y_offset = this._original_rows + legend_top_margin;
        break;
    }
    
    this._debug(function() {
      this._d.line(0.0, current_y_offset, this._raw_columns, current_y_offset);
    });
    
    Bluff.each(this._legend_labels, function(legend_label, index) {
      
      // Draw label
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.pointsize = this._scale_fontsize(this.legend_font_size);
      this._d.stroke = 'transparent';
      this._d.font_weight = 'normal';
      this._d.gravity = 'west';
      this._d.annotate_scaled(this._raw_columns, 1.0,
                        current_x_offset + (legend_square_width * 1.7), current_y_offset, 
                        this._truncate_legend_label(legend_label), this._scale);
      
      // Now draw box with color of this dataset
      this._d.stroke = 'transparent';
      this._d.fill = this._data[index][this.klass.DATA_COLOR_INDEX];
      this._d.rectangle(current_x_offset, 
                        current_y_offset - legend_square_width / 2.0, 
                        current_x_offset + legend_square_width, 
                        current_y_offset + legend_square_width / 2.0);
      
      current_y_offset += this._calculate_line_height();
    }, this);
    this._color_index = 0;
  },
  
  // Shorten long labels so they will fit on the canvas.
  _truncate_legend_label: function(label) {
    var truncated_label = String(label);
    while (this._calculate_width(this._scale_fontsize(this.legend_font_size), truncated_label) > (this._columns - this.legend_left_margin - this.right_margin) && (truncated_label.length > 1))
      truncated_label = truncated_label.substr(0, truncated_label.length-1);
    return truncated_label + (truncated_label.length < String(label).length ? "..." : '');
  }
});

